'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { RiDeleteBin7Line } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import styles from './style.module.scss';
import { toast } from 'sonner';
import FetchingLoader from '@/components/FetchingLoader/FetchingLoader';
import { IoCopy } from "react-icons/io5";
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);
  const [teamId, setTeamId] = useState<string>()
  const [registering, setRegistering] = useState(false);
  const [checkboxes, setCheckboxes] = useState([false, false, false]);

  const setStoreState = useTreasureHuntStore(store => store.setStoreState)

  // Create a ref array to store references to input elements
  const memberInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const shortId = uuidv4().split('-')[0];
    setTeamId(`team-${shortId}`);
  }, []);

  const toggleCheckbox = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    setCheckboxes(updatedCheckboxes);
  };

  const addMember = () => {
    if (teamMembers.length < 4) {
      const newTeamMembers = [...teamMembers, ""];
      setTeamMembers(newTeamMembers);

      setTimeout(() => {
        memberInputRefs.current[newTeamMembers.length - 1]?.focus();
      }, 0);
    }
  };

  const removeMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  // @ts-ignore
  const onSubmitForm = async (data) => {
    if (teamMembers.length < 3) {
      alert("You need at least 3 team members to register.");
      return;
    }

    const payload = {
      teamId: teamId,
      teamName: data.teamName,
      teamMembers: teamMembers.filter(name => name.trim() !== '')
    };


    try {
      setRegistering(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const data = await res.json();

        setStoreState({
          teamName: data.data.teamName,
          teamId: data.data.teamId,
          // currentQuestionStage: data.data.currentQuestionStage,
          // numberOfLives : data.data.numberOfLives,
          // hasPaid : data.data.hasPaid
        })
        router.push('/auth/login')
        toast.success('Team created successfully', {
          duration: 2500
        });
      } else {
        toast.error('Error creating team! Please try again', {
          duration: 2500
        });
      }
    } catch (error) {
      console.error("THE ERROR", error)
      toast.error('There was some error !Please bear with us!!', {
        duration: 2500
      });
    } finally {
      setRegistering(false)
    }
  };

  const copyToClipboard = async () => {
    try {
      if (teamId !== '') await navigator.clipboard.writeText(teamId as string);
      toast.info('Copied to clipboard', { duration: 1500 })
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const allChecked = checkboxes.every(Boolean);

  return (
    <div className={styles.main__container}>
      <form onSubmit={handleSubmit(onSubmitForm)} className={styles.user__register__form}>
        <div className='relative'>
          <label>Team Id</label>
            <input value={teamId} />
            <IoCopy className='cursor-pointer absolute right-0 bottom-3' onClick={() => {
              copyToClipboard()
            }} />
        </div>
        <div>
          <label htmlFor="teamName">Team Name</label>
          <input {...register('teamName', { required: 'Please enter a team name' })} />
        </div>
        <div>
          <label className='pb-[1rem]'>Team Members</label>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.member__input}>
              <input
                type="text"
                value={member}
                onChange={(e) => {
                  const newMembers = [...teamMembers];
                  newMembers[index] = e.target.value;
                  setTeamMembers(newMembers);
                }}
                ref={(el) => { memberInputRefs.current[index] = el; }}
                required
              />
              <button type="button" onClick={() => removeMember(index)} className={styles.remove__button}><RiDeleteBin7Line width='3rem' /></button>
            </div>
          ))}
          {teamMembers.length < 4 && (
            <button type="button" onClick={addMember} className={styles.add__button}>Add Member</button>
          )}
        </div>
        <div className={styles.checkbox__container}>
          {["I hereby consent that all my team members are from KGEC", "I have saved my teamID for future purposes", "I understand that only my device will be used for my team to play the game"].map((label, index) => (
            <div key={index} className={styles.checkbox__item}>
              <input
                type="checkbox"
                className='min-w-5 mt-1'
                id={`checkbox-${index}`}
                checked={checkboxes[index]}
                onChange={() => toggleCheckbox(index)}
              />
              <label htmlFor={`checkbox-${index}`}>{label}</label>
            </div>
          ))}
        </div>
        {teamMembers.length >= 3 && (
          registering ? <FetchingLoader /> : (<button type='submit' className={styles.submit__button} disabled={!allChecked}>Register Team</button>)
        )}
      </form>
    </div>
  );
};

export default Register;