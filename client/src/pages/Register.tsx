import { type FormEvent, useState } from "react";
import { User, Mail, Lock, Loader2, AlertCircle, Check, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordValid = password.length >= 6;

  return (
    <div className="min-h-screen w-full flex bg-[#EDEAE2]">
      <style>{`
        @keyframes travelCard {
          0%   { transform: translateY(0);    opacity: 1; }
          28%  { transform: translateY(0);    opacity: 1; }
          38%  { transform: translateY(72px); opacity: 1; }
          62%  { transform: translateY(72px); opacity: 1; }
          72%  { transform: translateY(144px); opacity: 1; }
          96%  { transform: translateY(144px); opacity: 1; }
          100% { transform: translateY(144px); opacity: 0; }
        }
        .travel-card { animation: travelCard 6s ease-in-out infinite; }
      `}</style>

      {/* Left dark panel */}
      <div className="hidden lg:flex lg:w-[45%] p-6">
        <div className="relative w-full rounded-3xl bg-[#111111] overflow-hidden flex flex-col justify-between p-8">
          <div className="relative flex items-center gap-2 z-10">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-black text-xs">
              S
            </div>
            <span className="text-white font-medium tracking-tight">SyncBoard</span>
          </div>

          <div className="relative flex flex-col gap-3 max-w-[220px] mx-auto w-full">
            {["To Do", "In Progress", "Done"].map((col) => (
              <div key={col} className="bg-white/[0.06] rounded-xl p-3 border border-white/10 h-[64px]">
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-1 px-1">{col}</p>
              </div>
            ))}
            <div className="travel-card absolute top-[26px] left-0 right-0 bg-white rounded-lg p-2.5 shadow-xl">
              <div className="h-1.5 w-2/3 bg-black/10 rounded-full mb-2" />
              <div className="flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-black" />
                </span>
                <div className="h-1 w-6 bg-black/10 rounded-full" />
              </div>
            </div>
          </div>

          <div className="relative flex items-end justify-between z-10">
            <div>
              <p className="text-white text-sm">Your next team</p>
              <p className="text-white/50 text-sm italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                is one invite away
              </p>
            </div>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
            >
              <ArrowUpRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1
            className="text-4xl leading-tight text-[#1A1A1A] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Create your{" "}
            <span className="italic text-[#6B6B6B]">workspace</span>
          </h1>
          <p className="text-[#6B6B6B] mb-9">
            Set up your account and invite your team in under a minute.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-wider text-[#6B6B6B] mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9A9A]" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-full border border-[#D8D4C8] bg-white text-[#1A1A1A] placeholder:text-[#B0ACA0] focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[#6B6B6B] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9A9A]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-full border border-[#D8D4C8] bg-white text-[#1A1A1A] placeholder:text-[#B0ACA0] focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-[#6B6B6B] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9A9A]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-full border border-[#D8D4C8] bg-white text-[#1A1A1A] placeholder:text-[#B0ACA0] focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition"
                />
              </div>
              {password.length > 0 && (
                <div className={`flex items-center gap-1.5 mt-2 ml-1 text-xs ${passwordValid ? "text-emerald-700" : "text-[#B0ACA0]"}`}>
                  <Check className="h-3 w-3" />
                  <span>At least 6 characters</span>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#111111] text-white font-medium py-3.5 rounded-full hover:bg-black active:bg-[#000] disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-[#6B6B6B] text-center mt-7">
            Already have an account?{" "}
            <a href="/login" className="text-[#1A1A1A] underline underline-offset-2">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;