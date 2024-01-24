import React from 'react';

import { EnvironmentNames, EnvironmentPropsType } from '@/types';

import { useStatusProvider } from '@/contexts/StatusProvider';
import { useImmutableProvider } from '@/contexts/ImmutableProvider';

import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';


function Environment({ disabled }: EnvironmentPropsType) {
  const { isLoading } = useStatusProvider();
  const { environment, setEnvironment } = useImmutableProvider();

  const onClick = (name: EnvironmentNames) => {
    if (setEnvironment) {
      setEnvironment(name);
    }
  };

  console.log('Environment', { isLoading, environment, setEnvironment })

  return (
    <Card className='tw-flex tw-flex-col tw-gap-10 tw-p-4'> 
      <CardTitle>
        <span>Environment</span>  
      </CardTitle>
      <CardContent>
        <div className='tw-flex tw-flex-col tw-gap-4'>
          {Object.entries(EnvironmentNames).map(([key, value]) => (
            <Button
              key={key}
              id={`radio-${key}`}
              name="environment"
              value={value}
              disabled={disabled}
              onClick={() => onClick(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Environment;
