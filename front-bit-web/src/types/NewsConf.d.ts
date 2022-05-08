/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-24 19:46:41
 * @Description : 新闻对象配置
 */
export interface NewsConf {
  /** 新闻类别  */
  code: string;
  /** 新闻ID  */
  id: number;
  /** 新闻封面  */
  image: string;
  /** 时间 */
  date: number;
  /** 标题 */
  title: string;
  /** 链接地址 */
  desc: string;
  /** 富文本 */
  html: string;
}
