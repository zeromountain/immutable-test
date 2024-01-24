"use client";
import Environment from "@/components/Environment";
import { useStatusProvider } from "@/contexts/StatusProvider";
import { usePassportProvider } from "@/contexts/PassportProvider";
import PassportMethods from "@/components/PassportMethods";
import Message from "@/components/Mesage";




export default function Home() {
  const {isLoading} = useStatusProvider();
  const {imxProvider, zkEvmProvider} = usePassportProvider();

  console.log('Home',{isLoading, imxProvider, zkEvmProvider})

  return (
    <main
      className="tw-h-[100vh] tw-flex tw-flex-col tw-gap-4 tw-justify-center tw-items-center tw-p-10 tw-bg-red-500"
    >
      <Environment disabled={isLoading || !!imxProvider || !!zkEvmProvider} />
      <PassportMethods />
      <Message />
    </main>
  );
}
