"use client";

import { useImmutableProvider } from "@/contexts/ImmutableProvider";
import { useSearchParams } from "next/navigation";

import React from "react";

function CallbackPage() {
  const {passportClient} = useImmutableProvider();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const init = async () => {  
    
    localStorage.setItem("code", String(code))

    // 팝업닫는 메서드
    passportClient.loginCallback();
  };

  React.useEffect(() => {
    init();
  }, []);

  return <div id="connect" />;
}

export default CallbackPage;
