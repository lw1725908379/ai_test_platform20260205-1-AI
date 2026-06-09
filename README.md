AI测试Agent系统与RAG系统集成架构详细设计
一、系统概述
本系统由两个核心子系统组成：

- **AI测试Agent系统** (`ai-test-agent-system/`) - 基于DeepAgent框架的智能测试用例生成Agent
- **Anything-Chat-RAG系统** (`anything-chat-rag/`) - 基于LightRAG的多模态RAG知识库服务
两个系统通过MCP (Model Context Protocol) 实现集成，Agent系统通过MCP客户端调用RAG服务进行知识检索。

二、系统架构图

┌─────────────────────────────────────────────────────────────────────────────┐
│                              客户端请求入口                                   │
│                     (LangGraph API / Direct API Call)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI测试Agent系统 (Port 2026)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     DeepAgent Framework                              │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────────┐ │   │
│  │  │ TestCase    │  │ Skills       │  │ Middleware Stack           │ │   │
│  │  │ Agent       │  │ Middleware   │  │ - RAGMiddleware            │ │   │
│  │  │             │  │              │  │ - PDFContextMiddleware     │ │   │
│  │  │             │  │              │  │ - DynamicModelSelection    │ │   │
│  │  └──────┬──────┘  └──────────────┘  └─────────────────────────────┘ │   │
│  │         │                                                              │   │
│  │         ▼                                                              │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐│   │
│  │  │                      Tools Layer                                   ││   │
│  │  │  - export_testcases_to_excel (Excel导出)                         ││   │
│  │  │  - extract_pdf_text_from_file (PDF解析)                         ││   │
│  │  │  - rag_query_data (MCP工具)                                      ││   │
│  │  │  - rag_graph_search (MCP工具)                                   ││   │
│  │  │  - rag_graph_get (MCP工具)                                       ││   │
│  │  │  - rag_graph_labels (MCP工具)                                    ││   │
│  │  └──────────────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
              │                                           ▲
              │ MCP (SSE)                                 │
              │  http://localhost:8008/sse                │
              ▼                                           │
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RAG MCP Server (Port 8008)                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    FastMCP Framework                                 │   │
│  │  - RAGServiceClient (HTTP客户端，重试/认证/JWT)                       │   │
│  │  - 7个MCP工具定义                                                    │   │
│  │  - 多租户支持 (X-Space-Id)                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
              │ HTTP REST API
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   LightRAG API Server (Port 9621)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  FastAPI Server                                                     │   │
│  │  ├── Document Routes (文档上传/处理)                                  │   │
│  │  ├── Query Routes (多模式查询)                                       │   │
│  │  ├── Graph Routes (知识图谱)                                         │   │
│  │  └── Ollama API (兼容Ollama)                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LightRAG Core                                                       │   │
│  │  ├── Entity/Relation Extraction (实体关系抽取)                        │   │
│  │  ├── Knowledge Graph Building (知识图谱构建)                           │   │
│  │  ├── Multi-mode Retrieval (local/global/hybrid/naive/mix)          │   │
│  │  └── Reranking (重排序)                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Storage Layer (4类存储，可插拔)                                      │   │
│  │  ├── KV Storage - JSON/PostgreSQL/Redis                            │   │
│  │  ├── Vector Storage - Nano/PG/Milvus/Qdrant/Neo4j                   │   │
│  │  ├── Graph Storage - NetworkX/Neo4j/PostgreSQL                       │   │
│  │  └── Doc Status Storage - JSON/PostgreSQL                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  RAGAnything (多模态文档处理)                                         │   │
│  │  ├── MineruParser / DoclingParser                                   │   │
│  │  ├── ImageModalProcessor (图像处理)                                  │   │
│  │  ├── TableModalProcessor (表格处理)                                  │   │
│  │  └── EquationModalProcessor (公式处理)                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
三、核心组件详解
3.1 AI测试Agent系统
3.1.1 Agent核心架构
基于框架: DeepAgent (LangGraph封装)

入口配置 (graph.json):


{
  "graphs": {
    "chat_agent": {
      "path": "./src/app/agents/testcase/agent.py:agent"
    }
  }
}
核心Agent定义 (agent.py):

组件	说明
llm	DeepSeek Chat模型
skills_middleware	Skills中间件，支持testcase和rag-query技能
dynamic_model_selection	动态模型选择（有图片→多模态模型，纯文本→DeepSeek）
RAGMiddleware	RAG工具动态控制
PDFContextMiddleware	PDF文档上下文处理
3.1.2 Skills体系
Agent内置7个Skills，位于 skills目录:

Skill	功能
rag-query	RAG知识检索（强制第一步执行）
requirement-analysis	需求分析
test-strategy	测试策略制定
test-case-design	测试用例设计
test-data-generator	测试数据构造
quality-review	质量评审
output-formatter	输出格式化
3.1.3 工具层
基础工具:

export_testcases_to_excel - 测试用例导出到Excel
extract_pdf_text_from_file - PDF文本提取
MCP RAG工具 (通过 tools.py 动态获取):

工具	功能
rag_query_data	结构化数据检索（实体/关系/文本块）
rag_graph_search	知识图谱实体模糊搜索
rag_graph_get	获取实体子图
rag_graph_labels	列出图谱标签
3.1.4 Agent工作流程

用户需求输入
      │
      ▼
┌─────────────────────────────────────┐
│ Phase 1: RAG知识检索（强制）          │
│ - 激活 rag-query Skill              │
│ - 提取核心实体词                     │
│ - 并行调用RAG工具                    │
│ - 标注 [RAG检索] 标签                │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│ Phase 2: 需求分析                   │
│ - 识别文档类型与结构                 │
│ - 提取功能模块列表                   │
│ - 建立功能测试矩阵                    │
│ - 标注风险区域                       │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│ Phase 3: 测试策略制定               │
│ - 确定测试类型                       │
│ - 规划测试深度                       │
│ - 制定优先级策略                     │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│ Phase 4: 测试用例设计               │
│ - 等价类划分                         │
│ - 边界值分析                         │
│ - 决策表法/状态转换/场景法            │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│ Phase 5: 质量自检                   │
│ - 10项快速检查                       │
│ - 输出汇总表                         │
└─────────────────────────────────────┘
3.2 RAG系统 (Anything-Chat-RAG)
3.2.1 核心架构
基于: LightRAG + RAGAnything

API服务端口: 9621 (默认)

主要模块:

模块	文件	功能
LightRAG Core	lightrag.py	核心RAG引擎
Query Routes	query_routes.py	查询API
Document Routes	document_routes.py	文档管理API
Graph Routes	graph_routes.py	知识图谱API
RAGAnything	raganything.py	多模态处理
3.2.2 查询模式
LightRAG支持6种查询模式:

模式	说明	适用场景
local	局部实体检索	关注特定实体细节
global	全局关系检索	宏观知识理解
hybrid	local + global融合	需要局部+全局上下文
naive	朴素向量检索	简单语义匹配
mix	KG + Vector融合	结构化推理+语义搜索（推荐）
bypass	直接LLM	不使用知识库
3.2.3 存储层
支持多种存储后端（可插拔）:

存储类型	支持的后端
KV Storage	JSON, PostgreSQL, Redis
Vector Storage	Nano, PostgreSQL, Milvus, Qdrant, Neo4j, Faiss
Graph Storage	NetworkX, Neo4j, PostgreSQL, Memgraph
Doc Status	JSON, PostgreSQL
3.2.4 多模态文档处理 (RAGAnything)
支持处理包含以下内容的PDF:

图像: ImageModalProcessor
表格: TableModalProcessor
公式: EquationModalProcessor
支持解析器: Mineru, Docling

3.3 系统集成
3.3.1 MCP集成架构

┌──────────────────┐         SSE          ┌──────────────────┐
│   AI Test Agent  │◄─────────────────────►│   RAG MCP Server │
│                  │    http://localhost   │    (Port 8008)   │
│  MultiServer     │       :8008/sse      │                  │
│  MCPClient       │                       │   FastMCP        │
└──────────────────┘                       └────────┬─────────┘
                                                   │
                                                   │ HTTP
                                                   ▼
                                         ┌──────────────────┐
                                         │  LightRAG API   │
                                         │  (Port 9621)    │
                                         └──────────────────┘
3.3.2 MCP Server配置
MCP Server 提供:

7个工具 (当前启用4个):

rag_query_data - 结构化检索
rag_graph_search - 图谱搜索
rag_graph_get - 子图获取
rag_graph_labels - 标签列表
认证方式:

JWT登录 (用户名/密码)
API Key
多租户: X-Space-Id请求头

可靠性:

自动重试 (3次)
指数退避
连接池管理
3.3.3 RAG Middleware
RAGMiddleware 实现:


class RAGMiddleware(AgentMiddleware):
    def wrap_model_call(self, request, handler):
        if self._is_rag_enabled(request):
            # 注入RAG工具和提示词
            return handler(self._inject_rag_prompt(request))
        # 过滤掉RAG工具
        return handler(self._filter_rag_tools(request))
四、部署架构
4.1 服务端口规划
服务	端口	说明
LangGraph API	2026	Agent系统入口
RAG MCP Server	8008	MCP协议转发
LightRAG API	9621	RAG核心服务
4.2 环境变量配置
Agent系统 (.env):


DEEPSEEK_API_KEY=xxx
LLM_API_BASE=https://api.deepseek.com/v1
LLM_MODEL=deepseek-chat
IMAGE_PARSER_API_KEY=xxx
RAG系统 (.env):


# LLM配置 (OpenAI/Ollama/Gemini等)
OPENAI_API_KEY=xxx

# 存储配置
KV_STORAGE=JsonKVStorage
VECTOR_STORAGE=NanoVectorDBStorage
GRAPH_STORAGE=NetworkXStorage

# 认证
LIGHTRAG_API_KEY=xxx
AUTH_ACCOUNTS=admin:admin123
五、数据流分析
5.1 测试用例生成流程

1. 用户输入: "为用户登录功能生成测试用例"
            │
            ▼
2. Agent接收请求 (LangGraph API)
            │
            ▼
3. SkillsMiddleware加载rag-query Skill
            │
            ▼
4. RAGMiddleware注入RAG工具到tools list
            │
            ▼
5. Agent执行rag_query_data:
   - 调用 MCP工具 → RAG MCP Server
   - MCP Server调用 LightRAG /query/data
   - 返回实体/关系/文本块
            │
            ▼
6. Agent基于RAG结果进行需求分析
            │
            ▼
7. Agent调用 test-case-design Skill
            │
            ▼
8. 生成测试用例 (如需导出→调用export_testcases_to_excel)
            │
            ▼
9. 返回结果给用户
六、关键设计原则
6.1 Agent系统铁律
先RAG，后分析: 任何需求必须先执行知识检索
无依据不臆测: 所有结论必须基于检索到的原始数据
五大量化: 预期结果必须具体可验证
6.2 RAG系统原则
多模态: 支持图像/表格/公式的文档处理
可插拔存储: 灵活选择存储后端
多查询模式: 根据场景选择最优检索策略
七、扩展点
扩展方向	说明
新增Skills	在skills目录添加新Skill
新增工具	在tools.py添加新工具函数
RAG存储	在kg/目录实现新的存储后端
LLM Provider	在llm/目录添加新的LLM绑定
