import { Storage } from '@plasmohq/storage';
import type { PlasmoContentScript } from 'plasmo';
import { B_API_VIDEO_INFO, matchBvidReg } from '~components/bilibili/config';
import { FOLLOW_X_KEY } from '~layouts/follow/config';
import type { IBVideoInfoQuery, IUpInfo } from '~types';
import { biliParser, uniqByKey } from '~utils';

export const config: PlasmoContentScript = {
  matches: ['https://www.bilibili.com/video/*']
};

const storage = new Storage();

const initPreviewEl = (el: Element) => {
  const fetchPreviewEl = document.createElement('div');
  fetchPreviewEl.title = '获取视频封面';
  fetchPreviewEl.innerText = '获取视频封面';
  fetchPreviewEl.style.cssText = 'margin-right: 18px;';
  el.prepend(fetchPreviewEl);

  fetchPreviewEl.addEventListener('click', async () => {
    const { bvid } = window.location.href.match(matchBvidReg).groups;
    const preview = await biliParser<IBVideoInfoQuery, string>(
      B_API_VIDEO_INFO,
      { bvid },
      'pic'
    );
    preview && window.open(preview);
  });
};

const initUpFollowEl = (el: Element) => {
  const fetchUpEl = document.createElement('div');
  fetchUpEl.title = '添加到 BViewer';
  fetchUpEl.innerText = '添加到 BViewer';
  fetchUpEl.style.cssText = 'margin-right: 18px;';
  el.prepend(fetchUpEl);

  fetchUpEl.addEventListener('click', async () => {
    const { bvid } = window.location.href.match(matchBvidReg).groups;
    const up = await biliParser<IBVideoInfoQuery, IUpInfo>(
      B_API_VIDEO_INFO,
      { bvid },
      'owner'
    );

    const origin = await storage.get(FOLLOW_X_KEY);
    origin
      ? storage.set(FOLLOW_X_KEY, uniqByKey([...origin, up], 'mid'))
      : storage.set(FOLLOW_X_KEY, [up]);

    fetchUpEl.innerHTML = `已添加 ${up.name}`;
    setTimeout(() => {
      fetchUpEl.remove();
    }, 3000);
  });
};

// 视频页中自动加载视频会重新加载
// 重新加载后 window load 失去绑定
setTimeout(() => {
  const toolbar = document.querySelector('.toolbar-right');
  const tag = document.querySelector('.manuscript-report');

  if (tag) {
    initPreviewEl(toolbar);
    initUpFollowEl(toolbar);
  }
}, 3000);
