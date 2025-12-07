'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if(!name.trim()) return setError('Name required');
    if(!email.includes('@')) return setError('Valid email required');
    if(password.length < 6) return setError('Password min 6 chars');
    setLoading(true);
    try{
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK;
      if(n8nUrl){
        try{
          await fetch(n8nUrl, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({uid:userCred.user.uid,email,name,createdAt:new Date().toISOString()})
          });
        }catch(err){ console.warn('n8n webhook failed', err);}
      }
      router.push('/dashboard');
    }catch(err){
      setError(err.message || 'Signup failed');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name"/>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
        <label>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="At least 6 chars"/>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading?'Signing up...':'Sign Up'}</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}
