示例：
修改说明：游戏得分提交
注释标记：20260408xxxx
修改文件：xxx文件，xxx文件
然后修改的地方里，加一个注释标识就是上面这个20260408xxx，标记都是你自己定义，我能搜就行


token存localstorage的时候记得加前缀哦
8bit_token这样
尽量减少互相干扰的情况，虽然基于请求地址分开的同名问题也不大，但最好标识一下清楚

在header里追加一个字段叫X-App-Code：8bit

insert into public.game_list (game_id, game_name, status)
values
('retro-dodge', 'Retro Dodge', 0),
('click-rush', 'Click Rush', 1),
('color-blitz', 'Color Blitz', 1),
('lane-shot', 'Lane Shot', 1),
('stack-rift', 'Stack Rift', 1),
('odd-tap', 'Odd Tap', 1),
('number-order', 'Number Order', 1),
('dot-dodge', 'Dot Dodge', 1);