const axios = require('axios');

(async () => {
  console.log('===== 开始执行Dify工作流 =====');
  
  try {
    // 1. 构造输入参数（避免打印密码）
    const inputs = {
      board_id: process.env.BOARD_ID,
      user_name: process.env.USER_NAME,
      password: process.env.LOGIN_PASSWORD  // 安全读取密码
    };
    console.log('✅ 输入参数:', { ...inputs, password: '***' }); // 屏蔽密码输出

    // 2. 调用Dify API（含重试机制）
    const API_URL = `${process.env.DIFY_BASE_URL}/console/api/run`;
    const MAX_RETRIES = 3;
    let response;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`📡 请求尝试 ${attempt}/${MAX_RETRIES}`);
        response = await axios.post(
          API_URL,
          {
            inputs,
            workflow_id: "73c4ad27-9b57-4d19-9db1-31d58350da95" // 替换为你的workflow_id
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': process.env.DIFY_TOKENS
            },
            timeout: 30000
          }
        );
        break; // 成功则跳出循环
      } catch (err) {
        if (attempt === MAX_RETRIES) throw err;
        console.warn(`⚠️ 请求失败，10秒后重试: ${err.message}`);
        await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒
      }
    }

    // 3. 检查响应结果
    if (response.data?.success) {
      console.log('✅ 工作流执行成功!');
    } else {
      throw new Error(response.data?.message || 'API返回未成功状态');
    }

  } catch (error) {
