import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TreasureHuntStoreType {
    teamName: string;
    teamId: string;
    currentQuestionStage: number;
    numberOfLives: number;
    qrCodeValue: string;
    hasPaid : boolean;
    isDisqualified : boolean;
    nextQuestionId : string;
    setStoreState: (newState: Partial<TreasureHuntStoreType>) => void;
}

const useTreasureHuntStore = create<TreasureHuntStoreType>()(
    persist(
        (set) => ({
            teamName: '',
            teamId: '',
            currentQuestionStage: -1,
            numberOfLives: 0,
            qrCodeValue: '',
            hasPaid : false,
            isDisqualified : false,
            nextQuestionId : '',
            setStoreState: (newState: Partial<TreasureHuntStoreType>) => {
                set((state) => ({ ...state, ...newState }));
            },
        }),
        {
            name: 'treasure-hunt-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useTreasureHuntStore;
