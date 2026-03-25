// "use client";
// import { useLayoutEffect } from "react";
// import { redirect } from "next/navigation";
// import { useRouter, usePathname } from "next/navigation";
// import useTreasureHuntStore from "@/hooks/useTreasureHuntStore";

// export const withAuth = (WrappedComponent: any) => {
//   return function WithAuth(props: any) {

//     // const progressString = useAppSelector(selectProgressString)
//     // const currentQuestionNumber= useAppSelector(selectCurrentQuestionNumber);
//     const router = useRouter()
//     const pathname = usePathname();

//     const  currentQuestionStage= useTreasureHuntStore(store => store.currentQuestionStage)

//     const questionNumber= Number(pathname.split('/')[2].split('q')[1])
//     // const progress = progressString.split('_').length -2

//     // console.log(questionNumber, progress)
    
//     // useLayoutEffect(() => {
//     //   if (progress !== questionNumber) {
//     //     router.push(`/question/q${currentQuestionNumber}`);
//     //   }
//     // }, [currentQuestionNumber, progress, questionNumber, router]);

//     // if(progress !== questionNumber) return null;


//     return <WrappedComponent {...props} />;
//   };
// };
