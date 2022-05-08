/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-15 20:39:37
 * @Description : TODO
 */
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      { libraryName: "vant", libraryDirectory: "es", style: true },
      "vant",
    ],
  ],
};
