"use client"

import {PassportError} from '@imtbl/sdk/passport'

import React, {
  PropsWithChildren,
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';



const MessageContext = createContext<{
  messages: string[],
  addMessage:(operation: string, ...messages: any[]) => void,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
}>({
      messages: [],
      isLoading: false,
      addMessage: () => null,
      setIsLoading: () => null,
    });

export function StatusProvider({
  children,
}: PropsWithChildren<{}>) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((operation: string, ...args: any[]) => {
    let messageString: string;
    if (!args?.length) {
      messageString = operation;
    } else if (args[0] instanceof PassportError) {
      messageString = `${operation}: ${args[0].type} - ${args[0].message}`;
    } else {
      messageString = `${operation}: ${args.map((arg) => {
        if (arg instanceof Error) {
          return arg.toString();
        }
        return JSON.stringify(arg, null, 2);
      }).join(' - ')}`;
    }
    setMessages((prevMessages) => [...prevMessages, messageString]);
  }, []);

  const providerValues = useMemo(() => ({
    messages,
    addMessage,
    isLoading,
    setIsLoading,
  }), [messages, addMessage, isLoading, setIsLoading]);

  return (
    <MessageContext.Provider value={providerValues}>
      {children}
    </MessageContext.Provider>
  );
}

export function useStatusProvider() {
  const {
    messages,
    addMessage,
    isLoading,
    setIsLoading,
  } = useContext(MessageContext);
  return {
    messages,
    addMessage,
    isLoading,
    setIsLoading,
  };
}
