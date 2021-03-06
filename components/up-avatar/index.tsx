import type { FC } from 'react';
import { useStorage } from '@plasmohq/storage';
import { useNavigate } from 'react-router-dom';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger
} from 'rctx-contextmenu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { IUpInfo } from '~types';
import { FOLLOW_X_KEY } from '~layouts/follow/config';
import styles from './index.module.scss';

interface UpAvatarProps {
  up: IUpInfo;
}

const UpAvatar: FC<UpAvatarProps> = (props) => {
  const navigator = useNavigate();
  const { up } = props;
  const [follow, setFollow] = useStorage<IUpInfo[]>(
    FOLLOW_X_KEY,
    (v) => v || []
  );
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: up.mid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const handleVisitUp = () => {
    chrome.tabs.create({ url: `https://space.bilibili.com/${up.mid}` });
  };

  const handleRemoveUp = () => {
    setFollow(follow.filter((v) => v.mid !== up.mid));
  };

  const handleToUpSpace = () => {
    navigator(`/up/${up.mid}`, {
      state: { up }
    });
  };

  return (
    <ContextMenuTrigger id={up.mid.toString()}>
      <div
        className={styles.wrapper}
        title={up.name}
        ref={setNodeRef}
        style={style}
        onClick={handleToUpSpace}
        {...attributes}
        {...listeners}
      >
        <div className={styles.innerWrapper}>
          <img className={styles.avatar} src={up.face} alt='up avatar' />
          <p className={styles.upName}>{up.name}</p>
        </div>
      </div>
      <ContextMenu
        id={up.mid.toString()}
        className={styles.contextMenu}
        appendTo='body'
        animation='fade'
      >
        <ContextMenuItem
          attributes={{ title: `访问 ${up.name} 主页` }}
          onClick={handleVisitUp}
        >
          {`访问 ${up.name}`}
        </ContextMenuItem>
        <ContextMenuItem
          attributes={{ title: `删除 ${up.name}` }}
          onClick={handleRemoveUp}
        >
          删除
        </ContextMenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  );
};

export default UpAvatar;
