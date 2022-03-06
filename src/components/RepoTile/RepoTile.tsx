import React from "react";

import Avatar from "@components/Avatar";
import StarIcon from "@components/StarIcon";
import { Link } from "react-router-dom";

import style from "./RepoTile.module.scss";

type RepoTileProps = {
  src?: string;
  item: {
    id: string;
    title: string;
    company: string;
    counterStar: number;
    lastUpdate: string;
  };
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const RepoTile: React.FC<RepoTileProps> = ({
  src,
  item,
  onClick,
}: RepoTileProps) => {
  return (
    <Link className={style.link} to={`/repos/${item.company}/${item.title}`}>
      <div
        onClick={onClick}
        id={`${item.id}`}
        key={item.id}
        className={style.repositoty}
      >
        <Avatar src={src} letter={item.title.slice(0, 1)} alt="" />
        <div className={style["repositoty__information-rep"]}>
          <p className={style.repositoty__title}>{item.title}</p>
          <p className={style.repositoty__company}>{item.company}</p>
          <div className={style.repositoty__details}>
            <StarIcon />
            <p className={style["repositoty__counter-star"]}>
              {item.counterStar}
            </p>
            <p className={style["repositoty__last-update"]}>
              {item.lastUpdate}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(RepoTile);
