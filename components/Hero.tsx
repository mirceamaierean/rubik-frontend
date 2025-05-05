import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative isolate">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cube-blue to-cube-red opacity-20 dark:opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Master the <span className="text-cube-red">Rubik&apos;s</span>{" "}
            <span className="text-cube-blue">Cube</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Solve your Rubik&apos;s cube with our intelligent solver. Upload a
            photo of your cube, and we&apos;ll guide you through the solution
            step by step.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/login"
              className="rounded-md bg-cube-blue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cube-blue/90 focus-visible:outline-offset-2 focus-visible:outline-cube-blue"
            >
              Start Solving
            </Link>
            <Link
              href="/learn"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-cube-blue dark:hover:text-cube-blue"
            >
              Learn More <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-cube-blue">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                </div>
                Fast Solution
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                <p className="flex-auto">
                  Get step-by-step instructions to solve your cube in minutes.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-cube-red">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                Smart Recognition
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                <p className="flex-auto">
                  Our AI-powered system accurately recognizes your cube&apos;s
                  state.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-cube-green">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    />
                  </svg>
                </div>
                Learn & Improve
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                <p className="flex-auto">
                  Understand the algorithms and improve your solving skills.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-cube-yellow to-cube-orange opacity-20 dark:opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}
