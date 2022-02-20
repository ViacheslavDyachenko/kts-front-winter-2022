import React from "react";

import style from "./Button.module.css";

type buttonProps = {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent) => void;
  disabled: boolean;
};

const Button: React.FC<buttonProps> = ({
  children,
  onClick,
  disabled,
}: buttonProps) => {
  return (
    <button className={style.search__btn} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default React.memo(Button);
