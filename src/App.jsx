import { useMemo, useState } from 'react';

const STORAGE_KEY = 'daylist-todos';
const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';
const FILTERS = ['All', 'Active', 'Completed'];
const STARTER_TODOS = [
  { id: 'welcome-1', text: 'Take a breath and make a little plan', completed: true },
  { id: 'welcome-2', text: 'Choose one thing to focus on today', completed: false },
  { id: 'welcome-3', text: 'Give yourself credit for showing up', completed: false },
];

function readTodos() {
  try {
    const storedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(storedTodos) ? storedTodos : STARTER_TODOS;
  } catch {
    return STARTER_TODOS;
  }
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('That email and password do not match. Try the demo details below.');
      return;
    }
    onLogin();
  }

  return (
    <main className="login-layout">
      <section className="login-story">
        <a className="brand" href="#home" aria-label="Daylist home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          daylist<span className="brand-period">.</span>
        </a>
        <div className="story-copy">
          <span className="eyebrow"><span className="sparkle">✳</span> A softer way to get things done</span>
          <h1>Make room<br />for what <em>matters.</em></h1>
          <p>A little list for the things you want to do — and a little space to be human while you do them.</p>
        </div>
        <div className="story-note"><span aria-hidden="true">✦</span><span>Small steps count.<br /><strong>So does taking a pause.</strong></span></div>
        <span className="story-decoration decoration-one" aria-hidden="true">✳</span>
        <span className="story-decoration decoration-two" aria-hidden="true">✿</span>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-brand"><span className="brand-mark" aria-hidden="true"><span /></span>daylist<span className="brand-period">.</span></div>
          <div className="form-heading">
            <span className="eyebrow">YOUR SPACE, JUST FOR YOU</span>
            <h2>Welcome back<span className="brand-period">.</span></h2>
            <p>Sign in and take today one thing at a time.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} />
            <div className="label-row"><label htmlFor="password">Password</label><span className="lock-note">Just between us <span aria-hidden="true">↗</span></span></div>
            <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button login-button" type="submit">Come on in <span aria-hidden="true">↗</span></button>
          </form>
          <div className="demo-hint"><span className="hint-icon" aria-hidden="true">✳</span><div><strong>Just looking around?</strong><span>Use the demo details to step inside.</span><code>student@example.com <b>·</b> password123</code></div></div>
          <p className="login-footnote">A calm corner of the internet, made for you <span aria-hidden="true">♡</span></p>
        </div>
      </section>
    </main>
  );
}

function TodoPage({ onLogout }) {
  const [todos, setTodos] = useState(readTodos);
  const [activeFilter, setActiveFilter] = useState('All');
  const [newTodo, setNewTodo] = useState('');

  function saveTodos(nextTodos) {
    setTodos(nextTodos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos));
  }

  function addTodo(event) {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;
    saveTodos([{ id: `${Date.now()}-${Math.random()}`, text, completed: false }, ...todos]);
    setNewTodo('');
  }

  function toggleTodo(id) {
    saveTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  function deleteTodo(id) {
    saveTodos(todos.filter((todo) => todo.id !== id));
  }

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => todos.filter((todo) => {
    if (activeFilter === 'Active') return !todo.completed;
    if (activeFilter === 'Completed') return todo.completed;
    return true;
  }), [todos, activeFilter]);
  const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <main className="todo-layout">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Daylist home"><span className="brand-mark" aria-hidden="true"><span /></span>daylist<span className="brand-period">.</span></a>
        <div className="topbar-right"><span className="today-label">A fresh page, every day <span aria-hidden="true">✳</span></span><button className="logout-button" onClick={onLogout}>Log out <span aria-hidden="true">↗</span></button></div>
      </header>
      <section className="todo-main">
        <div className="greeting-row"><div><span className="eyebrow date-eyebrow">{dateLabel.toUpperCase()} <span aria-hidden="true">·</span> YOUR LITTLE LIST</span><h1>One thing at a time<span className="brand-period">.</span></h1><p>Keep it simple. You’re doing just fine.</p></div><div className="sun-doodle" aria-hidden="true"><span>✳</span><small>take<br />it easy</small></div></div>
        <form className="add-todo-form" onSubmit={addTodo}><span className="add-icon" aria-hidden="true">＋</span><input aria-label="New todo" placeholder="What’s on your mind?" value={newTodo} onChange={(event) => setNewTodo(event.target.value)} /><button className="primary-button add-button" type="submit">Add to list <span aria-hidden="true">↗</span></button></form>
        <div className="list-toolbar"><div className="filter-tabs" aria-label="Filter todos">{FILTERS.map((filter) => <button key={filter} className={`filter-tab ${activeFilter === filter ? 'selected' : ''}`} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}{filter === 'All' && <span className="filter-count">{todos.length}</span>}</button>)}</div><span className="remaining-count"><strong>{remainingCount}</strong> {remainingCount === 1 ? 'thing' : 'things'} left <span aria-hidden="true">✳</span></span></div>
        <section className="todo-list" aria-label={`${activeFilter} todos`}>
          {visibleTodos.length ? visibleTodos.map((todo, index) => <article className={`todo-row ${todo.completed ? 'is-completed' : ''}`} key={todo.id} style={{ '--row-index': index }}><button className="check-button" aria-label={todo.completed ? `Mark ${todo.text} as active` : `Mark ${todo.text} as completed`} aria-pressed={todo.completed} onClick={() => toggleTodo(todo.id)}>{todo.completed && <span aria-hidden="true">✓</span>}</button><span className="todo-text">{todo.text}</span><button className="delete-button" aria-label={`Delete ${todo.text}`} onClick={() => deleteTodo(todo.id)}><span aria-hidden="true">×</span></button></article>) : <div className="empty-state"><span className="empty-doodle" aria-hidden="true">✿</span><strong>{activeFilter === 'Completed' ? 'Nothing checked off yet.' : activeFilter === 'Active' ? 'You’re all caught up.' : 'A little space to start.'}</strong><p>{activeFilter === 'Active' && todos.length ? 'Take a breath. You did it.' : 'Add a thought above whenever you’re ready.'}</p></div>}
        </section>
        <footer className="list-footer"><span><span aria-hidden="true">✿</span> Go at your own pace.</span><span>Your list saves as you go</span></footer>
      </section>
    </main>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('daylist-logged-in') === 'true');

  function logIn() {
    sessionStorage.setItem('daylist-logged-in', 'true');
    setIsLoggedIn(true);
  }

  function logOut() {
    sessionStorage.removeItem('daylist-logged-in');
    setIsLoggedIn(false);
  }

  return isLoggedIn ? <TodoPage onLogout={logOut} /> : <LoginPage onLogin={logIn} />;
}
