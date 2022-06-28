/**
 * 驼峰写法
 * @param  {String} str 要转化的字符串
 * @return {String}     转化后的字符串
 */
export function camelCase(str: string) {
  return str.replace(/-([a-z])/g, ($0, $1) => $1.toUpperCase()).replace('-', '');
}

/**
 * 格式化css属性对象
 * @param  {Object} props 属性对象
 * @return {Object}       添加前缀的格式化属性对象
 */
export function formatCss(props: { [key: string]: string }) {
  const prefixs = ['-webkit-', '-moz-', '-ms-'];

  const regPrefix = /transform|transition/;


  const result: { [key: string]: string } = Object.entries(props).reduce((obj, [key, styleValue]) => {
    if (regPrefix.test(key)) {
      for (let i = 0; i < prefixs.length; i++) {
        const styleName = camelCase(prefixs[i] + key);
        obj[styleName] = styleValue.replace(regPrefix, `${prefixs[i]}$&`);
      }
    }
    obj[key] = styleValue;
    return obj;
  }, {} as { [key: string]: string });
  return result;
}

/**
 * 为元素添加css样式
 * @param {Object} element 目标元素
 * @param {Object} props   css属性对象
 */
export function addPrefixCss(element: HTMLElement, props: { [key: string]: string }) {
  const formatedProps = formatCss(props);
  Object.entries(formatedProps).forEach(([key, value]) => {
    element.style[key as any] = value;
  });
}
