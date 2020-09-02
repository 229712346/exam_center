export var myMixin = {
  //组件中的其他属性 都可写在这里
  created: function () {
      this.hello();
      // 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。
      console.log('混入对象-created');
  },
  methods: {
      hello: function (msg='') {
          console.log('hello from mixin!' + msg);
      }
  }
};