import React from "react";

import { Link } from "react-router-dom";
import useReposListContext from "utils/useReposListContext";

import style from "./Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent) => void;
};

const Button: React.FC<ButtonProps> = ({ children, onClick }: ButtonProps) => {
  const { context } = useReposListContext();
  return (
    <Link to="/repos">
      <button
        className={style.btn}
        onClick={onClick}
        disabled={context.disabled}
      >
        {children}
      </button>
    </Link>
  );
};

export default React.memo(Button);
