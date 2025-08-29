import { Loader2 } from 'lucide-react';
import React from 'react';
type ILoadingProps = {
  type?: 'area' | 'app';
};
const Loading = ({ type = 'area' }: ILoadingProps = { type: 'area' }) => {
  return (
    <div className={`flex w-full justify-center items-center ${type === 'app' ? 'h-full' : ''}`}>
      <Loader2 className='animate-spin' />
    </div>
  );
};
export default Loading;
