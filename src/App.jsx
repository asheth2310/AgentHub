import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Cpu, 
  Code, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Search,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Terminal,
  Activity,
  Play,
  Copy,
  Check,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './index.css';

// --- DATA ---
const DOCS_CONTENT = [
  { id: 'rag', title: 'RAG Systems', path: '/rag', content: 'Retrieval Augmented Generation vector database embeddings langchain knowledge' },
  { id: 'fc', title: 'Function Calling', path: '/function-calling', content: 'OpenAI tool use function calling json schema structured output api' },
  { id: 'agents', title: 'Autonomous Agents', path: '/agents', content: 'agents reasoning loops react pattern langchain autonomy research' },
  { id: 'quick', title: 'Quickstart Guide', path: '/quickstart', content: 'getting started 10 minutes installation setup python agent.py' },
  { id: 'best', title: 'Best Practices', path: '/best-practices', content: 'security reliability production deployment prompt engineering' }
];

// --- COMPONENTS ---
const CodeBlock = ({ code, language, title, output }) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 1500);
  };

  return (
    <div className="code-block-container">
      <div className="code-header">
        <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
          <Terminal size={14} />
          <span>{title}</span>
        </div>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <button className="btn-icon" onClick={handleCopy}>
            {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
          </button>
          <button className="btn-icon run-btn" onClick={handleRun} disabled={isRunning}>
            <Play size={14} fill={isRunning ? "none" : "currentColor"} />
          </button>
        </div>
      </div>
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      {(isRunning || showOutput) && (
        <div className="terminal-output">
          <div className="output-header">Output Console</div>
          <div className="output-content">
            {isRunning ? (
              <span className="cursor-animate">{'>'} Running simulation...</span>
            ) : (
              <pre style={{padding:0, color:'#4ade80'}}>{output}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Feedback = ({ pageId }) => {
  const [selection, setSelection] = useState(null);
  const handleVote = (type) => {
    const feedback = JSON.parse(localStorage.getItem('agent_hub_feedback') || '{}');
    feedback[pageId] = feedback[pageId] || { up: 0, down: 0 };
    feedback[pageId][type]++;
    localStorage.setItem('agent_hub_feedback', JSON.stringify(feedback));
    setSelection(type);
  };

  return (
    <footer className="feedback-footer">
      <div className="feedback-prompt">
        {selection ? "Thanks for your feedback!" : "Was this page helpful?"}
      </div>
      {!selection && (
        <div className="feedback-buttons">
          <button className="btn-feedback" onClick={() => handleVote('up')}><ThumbsUp size={16} /> Yes</button>
          <button className="btn-feedback" onClick={() => handleVote('down')}><ThumbsDown size={16} /> No</button>
        </div>
      )}
      {selection === 'up' && <div style={{color:'var(--primary)', fontWeight:600}}><ThumbsUp size={16}/> Glad you found it useful!</div>}
      {selection === 'down' && <div style={{color:'var(--muted-foreground)', fontWeight:600}}><ThumbsDown size={16}/> Sorry to hear that. We'll improve it.</div>}
    </footer>
  );
};

// --- HOOKS ---
const useAnalytics = () => {
  const location = useLocation();
  useEffect(() => {
    const views = JSON.parse(localStorage.getItem('agent_hub_views') || '{}');
    const page = location.pathname;
    views[page] = (views[page] || 0) + 1;
    localStorage.setItem('agent_hub_views', JSON.stringify(views));
    
    // Track unique visits
    const session = sessionStorage.getItem('agent_hub_session');
    if (!session) {
      const visits = parseInt(localStorage.getItem('agent_hub_visits') || '0');
      localStorage.setItem('agent_hub_visits', (visits + 1).toString());
      sessionStorage.setItem('agent_hub_session', 'active');
    }
  }, [location]);
};

// --- PAGES ---
const Homepage = () => (
  <div className="page">
    <div className="hero-section">
      <span className="hero-badge">Curriculum v1.0</span>
      <h1 className="hero-title">Build Smarter <br/><span className="text-gradient">AI Agents</span></h1>
      <p className="hero-description">
        From RAG to autonomous reasoning loops. Master the framework-agnostic concepts of modern AI development.
      </p>
      <div style={{marginTop: '2rem', display:'flex', gap:'1rem'}}>
        <Link to="/quickstart" className="btn-primary">Get Started</Link>
        <Link to="/rag" className="btn-outline">Explore Concepts</Link>
      </div>
    </div>
    
    <div className="features-grid">
      <div className="feature-card">
        <div className="feature-icon"><Zap /></div>
        <h3>High Performance</h3>
        <p>Production-ready patterns for low-latency agent responses.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon"><ShieldCheck /></div>
        <h3>Reliable & Robust</h3>
        <p>Best practices for error handling and feedback loops.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon"><Users /></div>
        <h3>Developer First</h3>
        <p>Clean code examples using LangChain and OpenAI API.</p>
      </div>
    </div>
  </div>
);

const RAGPage = () => {
  const code = `# Python RAG with LangChain
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import RetrievalQA

loader = TextLoader("state_of_the_union.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
db = Chroma.from_documents(texts, embeddings)
qa = RetrievalQA.from_chain_type(llm=ChatOpenAI(), chain_type="stuff", retriever=db.as_retriever())

query = "What did the president say about Ketanji Brown Jackson?"
qa.run(query)`;

  const output = `> Loading vector database...
> Embedding search query...
> Retrieved 4 relevant chunks.
> Result: The President stated that Ketanji Brown Jackson is one of our nation's top legal minds...`;

  return (
    <div className="page">
      <h1>Retrieval Augmented Generation</h1>
      <p>RAG enables your LLM to access data it wasn't trained on by retrieving relevant context and injecting it into the prompt.</p>
      
      <div className="concept-card">
        <h3>Why RAG?</h3>
        <ul>
          <li><strong>Accuracy:</strong> Reduces hallucinations by forcing context adherence.</li>
          <li><strong>Timeliness:</strong> Access real-time data or internal docs.</li>
          <li><strong>Cost-Effective:</strong> No need for expensive fine-tuning.</li>
        </ul>
      </div>

      <CodeBlock title="langchain_rag.py" language="python" code={code} output={output} />
      <Feedback pageId="rag" />
    </div>
  );
};

const FCPage = () => {
  const code = `import openai

tools = [{
    "type": "function",
    "function": {
        "name": "get_stock_price",
        "description": "Get the current stock price of a company",
        "parameters": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Stock symbol (e.g. AAPL)"}
            },
            "required": ["symbol"]
        }
    }
}]

response = openai.chat.completions.create(
    model="gpt-4-turbo",
    messages=[{"role": "user", "content": "What is NVIDIA's price?"}],
    tools=tools
)`;
  const output = `> Model reasoning: User is asking for stock price.
> Tool Call: get_stock_price(symbol="NVDA")
> Tool Result: {"price": 124.50, "currency": "USD"}
> Final Answer: NVIDIA (NVDA) is currently trading at $124.50 USD.`;

  return (
    <div className="page">
      <h1>Function Calling</h1>
      <p>Function calling allows models to reliably output structured data and trigger external actions through your code.</p>
      <CodeBlock title="openai_tools.py" language="python" code={code} output={output} />
      <Feedback pageId="function-calling" />
    </div>
  );
};

const AgentsPage = () => {
  const code = `from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0)
tools = [Tool(name="Search", func=my_search, description="Useful for web search")]

agent = initialize_agent(
    tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)

agent.run("Who is the CEO of Google and what is their latest project?")`;
  const output = `> Entering new AgentExecutor chain...
> Thought: I need to search for the CEO of Google and their latest project.
> Action: Search
> Action Input: "CEO of Google latest project"
> Observation: Sundar Pichai is the CEO of Google. Recent projects include Gemini AI...
> Thought: I have enough information.
> Final Answer: Sundar Pichai is the CEO...`;

  return (
    <div className="page">
      <h1>Autonomous Agents</h1>
      <p>Agents use a "reasoning loop" (like ReAct) to dynamically plan and execute a sequence of tool calls to achieve a goal.</p>
      <CodeBlock title="agent_executor.py" language="python" code={code} output={output} />
      <Feedback pageId="agents" />
    </div>
  );
};

const DashboardPage = () => {
  const views = JSON.parse(localStorage.getItem('agent_hub_views') || '{}');
  const totalVisits = parseInt(localStorage.getItem('agent_hub_visits') || '0');
  const feedback = JSON.parse(localStorage.getItem('agent_hub_feedback') || '{}');
  
  const chartData = useMemo(() => {
    return Object.entries(views).map(([path, count]) => ({
      name: path === '/' ? 'Home' : path.replace('/', '').toUpperCase(),
      views: count
    }));
  }, [views]);

  const totalViews = Object.values(views).reduce((a, b) => a + b, 0);

  return (
    <div className="page">
      <h1>Platform Analytics</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label"><Activity size={14}/> Total Page Views</div>
          <div className="stat-value">{totalViews}</div>
          <div className="stat-trend">+12% from last week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><Users size={14}/> Unique Visitors</div>
          <div className="stat-value">{totalVisits}</div>
          <div className="stat-trend">High retention (68%)</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><Clock size={14}/> Avg. Time on Site</div>
          <div className="stat-value">4:32</div>
          <div className="stat-trend">Standard for docs</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-container">
          <h3>Traffic Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip 
                contentStyle={{background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px'}}
                cursor={{fill: 'var(--muted)', opacity: 0.4}}
              />
              <Bar dataKey="views" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <h3>Completion Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="var(--primary)" strokeWidth={3} dot={{fill: 'var(--primary)', r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const QuickstartPage = () => (
  <div className="page">
    <h1>Quickstart Guide</h1>
    <div className="concept-card">
      <p>Get your first agent running in under 10 minutes with this streamlined guide.</p>
    </div>
    
    <div style={{marginTop: '2rem'}}>
      <h3>1. Initialize Environment</h3>
      <p>Ensure you have Python 3.9+ installed and set up your OpenAI API key.</p>
      <CodeBlock 
        title="setup.sh" 
        language="bash" 
        code="pip install langchain openai chromadb" 
        output="Successfully installed langchain-0.1.0 openai-1.10.0 chromadb-0.4.22"
      />
    </div>

    <div style={{marginTop: '2rem'}}>
      <h3>2. Create Your First Agent</h3>
      <p>Copy this minimal \"Hello World\" agent into a file named <code>app.py</code>.</p>
      <CodeBlock 
        title="app.py" 
        language="python" 
        code={`from langchain_openai import ChatOpenAI\\nllm = ChatOpenAI()\\nprint(llm.invoke(\"Say Hello!\").content)`} 
        output="Hello! I am your AI assistant. How can I help you today?"
      />
    </div>
    
    <Feedback pageId="quickstart" />
  </div>
);

const BestPracticesPage = () => (
  <div className="page">
    <h1>Best Practices</h1>
    <p>Building production-grade AI agents requires moving beyond simple prompts to robust system design.</p>
    
    <div className="stats-grid" style={{marginTop:'2rem'}}>
      <div className="stat-card">
        <ShieldCheck className="icon" color="var(--primary)" />
        <h3>Security First</h3>
        <p>Never expose API keys in client-side code. Use server-side proxies and environment variables.</p>
      </div>
      <div className="stat-card">
        <Activity className="icon" color="var(--primary)" />
        <h3>Observability</h3>
        <p>Log every thought, action, and observation. Use tools like LangSmith for debugging traces.</p>
      </div>
    </div>

    <div className="concept-card" style={{marginTop:'2rem'}}>
      <h3>Reliability Checklist</h3>
      <ul>
        <li>Implement exponential backoff for rate limits.</li>
        <li>Set maximum iteration limits for autonomous loops.</li>
        <li>Validate all structured output against a schema.</li>
        <li>Use temperature=0 for consistent reasoning.</li>
      </ul>
    </div>
    
    <Feedback pageId="best-practices" />
  </div>
);

// --- LAYOUT ---
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      const filtered = DOCS_CONTENT.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) || 
        doc.content.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <Search size={18} color="var(--muted-foreground)" />
        <input 
          type="text" 
          placeholder="Search topics (e.g. RAG, Tools)..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {results.length > 0 && (
        <div className="search-results">
          {results.map(res => (
            <div key={res.id} className="search-result-item" onClick={() => { navigate(res.path); setQuery(''); }}>
              <strong>{res.title}</strong>
              <span>Documentation Path: {res.path}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Layout = ({ children }) => {
  useAnalytics();
  const location = useLocation();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header" onClick={() => window.location.href = '/'}>
          <div className="logo-spark">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="logo-text">AgentHub</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" className="nav-link" end><Home size={18} /> Home</NavLink>
          <div className="nav-group">Foundation</div>
          <NavLink to="/rag" className="nav-link"><BookOpen size={18} /> RAG Systems</NavLink>
          <NavLink to="/function-calling" className="nav-link"><Cpu size={18} /> Function Calling</NavLink>
          <NavLink to="/agents" className="nav-link"><Code size={18} /> Autonomous Agents</NavLink>
          <div className="nav-group">Resources</div>
          <NavLink to="/quickstart" className="nav-link"><Zap size={18} /> Quickstart</NavLink>
          <NavLink to="/best-practices" className="nav-link"><ShieldCheck size={18} /> Best Practices</NavLink>
          <div className="nav-group">Admin</div>
          <NavLink to="/dashboard" className="nav-link"><BarChart3 size={18} /> Dashboard</NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-nav">
           <SearchBar />
           <div className="nav-actions">
             <div className="status-pill">
               <div className="pulse-dot"></div>
               SYSTEM ACTIVE
             </div>
           </div>
        </header>
        
        <div className="content-container">
          <div className="breadcrumbs">
            Docs <ChevronRight size={12} /> {location.pathname === '/' ? 'Home' : location.pathname.substring(1).replace('-', ' ')}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/rag" element={<RAGPage />} />
          <Route path="/function-calling" element={<FCPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/quickstart" element={<QuickstartPage />} />
          <Route path="/best-practices" element={<BestPracticesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
