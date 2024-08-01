const ErrorPage=()=>{
    return <div className="mt-10 md:mt-30">
        <div className="text-center">
            <h1 className="mb-3 text-3xl font-semibold md:mb-4 md:text-6xl md:font-semibold text-primary">404</h1>
            <p className="mb-3 text-md md:mb-4 md:text-lg text-gray-600">Oops! Looks like you're lost.</p>
            <div className="animate-bounce">
              <svg className="h-12 w-12 mx-auto md:h-16 md:w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
            <p className="mt-4 text-gray-600">Let's get you back <a href="/" className="text-blue-500">home</a>.</p>
        </div>
    </div>
}

export default ErrorPage;