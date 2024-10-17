import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { login, signup } from './actions'

export default async function LoginPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/feed')
  }
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-red-600 font-mono">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-red-600 font-mono"
          >
            email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
            placeholder="m@example.com"
          />
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-red-600 font-mono"
          >
            password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
          />
          <button
            className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            formAction={login}
          >
            Log in
          </button>
          <div className="mt-4 text-center text-sm font-mono">
            Don&apos;t have an account?{' '}
            <button formAction={signup} className="underline">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
