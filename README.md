## 项目拾忆
### 目录结构
      - Home 主页 拾忆
      - HomePreview 主页点击后 详情页面
      - My 我的页面
            - Collection 收藏页面
            - Feedback 反馈页面

### 功能
- Home 所有项目展示页面：、首次加载暂时10条数据、触底事件发送再次请求数据、直到数据加载完成后提示已全部加载完成

- HomePreview 图片展示页面：点击Home上的某一个项目时跳转到当前页面、当前页面显示详情内容、如点赞、收藏、评论等功能。

- My 我的页面：主要功能为登录、清除缓存、联系我们、产品反馈、个人收藏等内容。

### 数据库  

- 登录数据表为：ChaoTu_User 
- 收藏数据表为：ChaoTu_Collect 
- 项目数据列表：ChaoTu_Item
- 评论数据列表：ChaoTu_Comment
- 反馈数据列表：ChaoTu_Feedback
- 联系我们&&分享数据数据列表：ChaoTu_Author

### 存储 ChaoTu_Image

- author 联系我们 和 分享图片存储
- authorItem 项目人头像存储
- item 每个项目的图片【里面分为每个项目人的项目author、个人项目里边有多少个项目列表】