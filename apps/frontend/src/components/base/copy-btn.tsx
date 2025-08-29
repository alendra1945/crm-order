'use client';
import copy from 'copy-to-clipboard';
import { useState } from 'react';

import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { Check, Copy } from 'lucide-react';

type ICopyBtnProps = {
  value: string;
  className?: string;
  isPlain?: boolean;
};

const CopyBtn = ({ value, className, isPlain }: ICopyBtnProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied) {
      return;
    }
    copy(value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className={`${className}`}>
      <Tooltip>
        <TooltipTrigger>
          <div
            className='box-border w-fit p-1 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 bg-white cursor-pointer'
            style={
              !isPlain
                ? {
                    boxShadow: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
                  }
                : {}
            }
            onClick={handleCopy}
          >
            {isCopied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='text-xs text-gray-500 bg-white shadow-md px-2 py-1 rounded-md'>
            {isCopied ? 'Copied' : 'Copy'}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default CopyBtn;
