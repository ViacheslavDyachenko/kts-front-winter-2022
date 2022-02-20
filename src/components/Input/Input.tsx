import React from "react";

import style from "./Input.module.css";

type inputProps = {
  value: string;
  placeholder: string;
  onChange: (event: React.FormEvent) => void;
};

const Input: React.FC<inputProps> = ({
  value,
  placeholder,
  onChange,
}: inputProps) => {
  return (
    <input
      className={style.search__input}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    ></input>
  );
};

export default React.memo(Input);
