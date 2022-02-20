import React from "react";

import Avatar from "@components/Avatar";
import StarIcon from "@components/StarIcon";

import style from "./RepoTile.module.css";

type repoTileProps = {
  src?: string;
  letter: string;
  item: {
    id: string;
    title: string;
    company: string;
    counterStar: number;
    lastUpdate: string;
  };
  onClick: (event: React.MouseEvent) => void;
};

const RepoTile: React.FC<repoTileProps> = ({
  src,
  letter,
  item,
  onClick,
}: repoTileProps) => {
  return (
    <div
      onClick={onClick}
      id={`${item.id}`}
      key={item.id}
      className={style.repositoty}
    >
      <Avatar src={src} letter={letter} />
      <div className={style["repositoty__information-rep"]}>
        <p className={style.repositoty__title}>{item.title}</p>
        <p className={style.repositoty__company}>{item.company}</p>
        <div className={style.repositoty__details}>
          <StarIcon />
          <div className={style["repositoty__counter-star"]}>
            {item.counterStar}
          </div>
          <p className={style["repositoty__last-update"]}>{item.lastUpdate}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RepoTile);
