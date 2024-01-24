"use client";

import { useImmutableProvider } from "@/contexts/ImmutableProvider";
import { usePassportProvider } from "@/contexts/PassportProvider";
import { useSearchParams } from "next/navigation";

import React from "react";

function CallbackPage() {
  const {passportClient} = useImmutableProvider();
  const {connectZkEvm, requestAccounts, requestSignature} = usePassportProvider();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const init = async () => {  
    
    localStorage.setItem("code", String(code))

    const promises = [connectZkEvm, requestAccounts, requestSignature]

    await Promise.allSettled(promises.map((promise) => promise())).then((results: unknown) => {
      console.log({results})
    });

    // 팝업닫는 메서드
    passportClient.loginCallback();
  };

  React.useEffect(() => {
    init();
  }, []);

  return <div id="connect" />;
}

export default CallbackPage;
