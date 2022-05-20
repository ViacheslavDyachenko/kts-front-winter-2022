import React from "react";

import style from "./Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent) => void;
  disabled: boolean;
};
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button className={style.btn} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default React.memo(Button);
