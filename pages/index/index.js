Page({

  leftMove: 0,
  rightMove: 0,
  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true,
    actionSheetItems: [],
    title: "",
    desc: "",
    voice: 0,
    leftAnimationData: {},
    rightAnimationData: {},
    leftTime: 0,
    rightTime: 0,
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var configs = wx.getStorageSync('configs');
    var actionSheetItems = [];
    var first = true;
    for (var i in configs) {
      var config = configs[i];
      if (config.state) {
        if (first) {
          var desc = config.desc.replace(/@/g, config.time + "秒")
          this.setData({
            title: config.name,
            desc: desc,
            leftTime: config.time,
            rightTime: config.time,
            voice: config.voice
          });
          first = false;
        }
        actionSheetItems.push({
          name: config.name,
          id: config.id
        })
      }
    }
    this.setData({
      actionSheetItems: actionSheetItems
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  actionSheetTap: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  /**
   * 切换item
   */
  bindItemTap: function(e) {
    this.leftStop();
    this.rightStop();
    var id = e.target.id;
    var configs = wx.getStorageSync('configs');
    var config = configs[id];
    var desc = config.desc.replace(/@/g, config.time + "秒");
    this.setData({
      title: config.name,
      desc: desc,
      actionSheetHidden: true,
      leftTime: config.time,
      rightTime: config.time,
      voice: config.voice,
    });
  },

  leftStart: function() {
    this.rightStop() //停止另一方计时
    //判断停止还是计时
    if (this.leftInterval && this.leftInterval != 0) {
      this.leftStop(); //停止计时
      return;
    }

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    var page = this;
    var leftInterval = setInterval(function() {
      if (page.data.leftTime <= 0) {
        page.leftStop();
        return
      }

      if (page.data.leftTime <= page.data.voice) {
        page.audioPlay()
      }

      animation.rotate(page.leftMove += 100).step();
      page.setData({
        leftAnimationData: animation.export(),
        leftTime: page.data.leftTime - 1
      });
    }, 1000);
    this.leftInterval = leftInterval;

  },

  leftStop: function() {
    clearInterval(this.leftInterval);
    this.leftInterval = 0
    this.audioPause()
  },

  rightStart: function() {
    this.leftStop() //停止另一方计时
    if (this.rightInterval && this.rightInterval != 0) {
      this.rightStop();
      return;
    }

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    var page = this
    var rightInterval = setInterval(function() {
      if (page.data.rightTime <= 0) {
        page.rightStop();
        return
      }

      if (page.data.rightTime <= page.data.voice) {
        page.audioPlay()
      }

      animation.rotate(page.rightMove += 100).step();
      page.setData({
        rightAnimationData: animation.export(),
        rightTime: page.data.rightTime - 1
      })
    }, 1000);
    this.rightInterval = rightInterval;
  },

  rightStop: function() {
    clearInterval(this.rightInterval);
    this.rightInterval = 0
    this.audioPause()
  },

  audioPlay: function() {
    this.audioCtx.play()
  },

  audioPause: function() {
    this.audioCtx.pause()
  }

})