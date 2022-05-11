import React from "react";

import style from "./Input.module.scss";

type InputProps = {
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  onChange,
}: InputProps) => {
  return (
    <input
      className={style.input}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default React.memo(Input);
