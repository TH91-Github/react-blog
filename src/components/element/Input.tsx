import React, { useCallback, useState } from "react";

export default function Input() {
  const [val, setVal] = useState<string>('');
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setVal(value)
  }, [])
  return (
    <input value={val} onChange={onChange} />
  )
}
