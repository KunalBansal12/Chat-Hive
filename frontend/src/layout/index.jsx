import logo from '../assets/logo.png'

const AuthLayout=({children})=>{
    return <div>
        <>
            <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
                <img 
                  src={logo}
                  alt='logo'
                  width={100}
                  height={60}
                />
            </header>

            {children}
        </>
    </div>
}

export default AuthLayout;