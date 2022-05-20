import React from "react";

import Image from "next/image";

import style from "./Avatar.module.scss";

type AvatarProps = {
  src?: string;
  alt: string;
  letter: string;
};

const Avatar: React.FC<AvatarProps> = ({ src, letter }: AvatarProps) => {
  return src ? (
    <Image className={style.avatar} src={src} alt="" width={80} height={80} />
  ) : (
    <span className={style.avatar}>{letter}</span>
  );
};

export default React.memo(Avatar);
