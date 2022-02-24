import React from "react";

import style from "./Avatar.module.css";

type AvatarProps = {
  src?: string;
  alt: string;
  letter: string;
};

const Avatar: React.FC<AvatarProps> = ({ src, letter }: AvatarProps) => {
  return src ? (
    <img className={style.avatar} src={src} alt=""></img>
  ) : (
    <span className={style.avatar}>{letter}</span>
  );
};

export default React.memo(Avatar);
