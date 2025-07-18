const axios = require('axios');

(async () => {
  try {
    console.log('===== 开始执行Dify工作流 =====');
    
    // 1. 解析输入参数
    const inputs = JSON.parse(process.env.DIFY_INPUTS || '{}');
    console.log('✅ 输入参数:', inputs);
    
    // 2. 验证必要参数
    if (!inputs.board_id || !inputs.user_name) {
      throw new Error('缺少必填参数: board_id 或 user_name');
    }
    
    // 3. 调用Dify API
    const API_URL = `${process.env.DIFY_BASE_URL}/console/api/run`;
    console.log(`📡 请求地址: ${API_URL}`);
    
    const response = await axios.post(
      API_URL,
      {
        inputs,
        workflow_id: "73c4ad27-9b57-4d19-9db1-31d58350da95" // 替换为您的workflow_id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.DIFY_TOKENS
        },
        timeout: 30000 // 30秒超时
      }
    );
    
    // 4. 检查响应结果
    if (response.data && response.data.success) {
      console.log('✅ 工作流执行成功!');
      console.log('📋 响应数据:', response.data);
    } else {
      throw new Error(response.data.message || '工作流执行失败');
    }
    
  } catch (error) {
    // 5. 错误处理
    console.error('❌ 发生错误:', error.message);
    
    if (error.response) {
      console.error('📊 API响应错误:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    // 确保以错误代码退出（Exit code 1）
    process.exit(1);
  }
})();
