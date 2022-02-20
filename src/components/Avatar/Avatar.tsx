import React from "react";

import style from "./Avatar.module.css";

type avatarProps = {
  src?: string;
  letter: string;
};

const Avatar: React.FC<avatarProps> = ({ src, letter }: avatarProps) => {
  return (
    <span>
      {src ? (
        <img className={style.repositoty__avatar} src={src} alt=""></img>
      ) : (
        <span className={style.repositoty__avatar}>{letter}</span>
      )}
    </span>
  );
};

export default React.memo(Avatar);
