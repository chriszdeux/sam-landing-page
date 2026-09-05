// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Obtención del despachador para emitir acciones al store
// 3-Gestión de estado local para code
// 4-Selección de datos desde el estado global de Redux
// 5-Gestión de estado local para step
// 6-Obtención del despachador para emitir acciones al store
// 7-Efecto secundario para sincronización del ciclo de vida
// 8-Procesamiento de envío de formulario para genérico
// 9-Estructuración y renderizado visual del componente UI
// 10-Estructuración y renderizado visual del componente UI
// 11-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

//# 2-Obtención del despachador para emitir acciones al store
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { validateAccount, register as registerUser, login } from '../../../lib/features/auth/actions';
import { clearRegistrationData } from '../../../lib/features/auth/reducer';
import { CheckCircle2, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function VerifyPage() {


    //# 3-Gestión de estado local para code
    const [code, setCode] = useState('');

    //# 4-Selección de datos desde el estado global de Redux
    const { registrationData, status, error } = useAppSelector((state) => state.auth);


    //# 5-Gestión de estado local para step
    const [step, setStep] = useState<'registering' | 'verifying' | 'animating_confirmation'>(
        registrationData ? 'registering' : 'verifying'
    );
    const router = useRouter();

    //# 6-Obtención del despachador para emitir acciones al store
    const dispatch = useAppDispatch();




    //# 7-Efecto secundario para sincronización del ciclo de vida
    const hasRegistered = React.useRef(false);

    useEffect(() => {
        if (step === 'registering' && registrationData && !hasRegistered.current) {
            hasRegistered.current = true;
            const performRegister = async () => {
                const result = await dispatch(registerUser(registrationData));
                if (registerUser.fulfilled.match(result)) {
                    setTimeout(() => {
                        setStep('verifying');
                    }, 2000);
                }
            };
            performRegister();
        } else if (step === 'registering' && !registrationData) {

            setTimeout(() => setStep('verifying'), 0);
        }
    }, [step, registrationData, dispatch]);



    //# 8-Procesamiento de envío de formulario para genérico
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        setStep('animating_confirmation');


        setTimeout(async () => {

            const result = await dispatch(validateAccount({ code }));

            if (validateAccount.fulfilled.match(result)) {

                // El auto-login se hace con los datos que setRegistrationData dejó en Redux
                // (en memoria) al enviar el formulario, no con la contraseña persistida en
                // localStorage. Si el usuario recargó o volvió más tarde ya no están, y
                // entonces aterriza en el home para entrar por el modal de login normal:
                // el auto-login es una comodidad, no vale persistir la contraseña por ella.
                const email = registrationData?.email;
                const password = registrationData?.password;

                if (email && password) {
                    await dispatch(login({ email, password }));
                }

                // La contraseña deja de hacer falta en cuanto se intenta el login.
                dispatch(clearRegistrationData());
                router.push('/');
            } else {

                setStep('verifying');
            }
        }, 4000);
    };

    if (step === 'registering') {



        //# 9-Estructuración y renderizado visual del componente UI
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505]">
                <div className="relative mb-8 h-20 w-20">
                    <div className="absolute h-20 w-20 animate-spin rounded-full border-2 border-[#00f3ff] [border-right-color:transparent] [border-bottom-color:transparent]" />
                    <div className="absolute h-20 w-20 rounded-full border-2 border-[#00f3ff]/20 [animation:spin_3s_linear_infinite] [border-left-color:transparent]" />
                </div>

                <Typography variant="h4" className="mb-4 font-bold text-white">
                    Creando tu identidad digital...
                </Typography>

                {error && (
                    <div className="mt-4 text-center">
                        <Typography component="p" className="text-error">
                            Error: {error}
                        </Typography>
                        <Button
                            onClick={() => router.back()}
                            sx={{ mt: 2, color: '#00f3ff' }}
                        >
                            Volver
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    if (step === 'animating_confirmation') {


        //# 10-Estructuración y renderizado visual del componente UI
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505]">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-[#00f3ff] bg-[#00f3ff]/10 shadow-[0_0_30px_rgba(0,243,255,0.4)]">
                        <CheckCircle2 size={60} className="text-[#00f3ff]" />

                        { }
                        <div className="absolute h-full w-full rounded-full border border-dashed border-[#00f3ff]/50 [animation:spin_4s_linear_infinite]" />
                        <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                </motion.div>

                <Typography variant="h4" className="mb-4 font-bold text-white">
                    Verificando Credenciales...
                </Typography>
                <Typography variant="body1" className="text-white/70">
                    Estableciendo conexión segura
                </Typography>
            </div>
        );
    }




    //# 11-Estructuración y renderizado visual del componente UI
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#050510] p-6">
            { }
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full max-w-[400px] rounded-2xl border border-[#00f3ff]/20 bg-white/5 p-12 text-center shadow-[0_0_30px_rgba(0,243,255,0.1)] backdrop-blur-md">
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/10">
                        <Unlock size={40} className="text-[#00f3ff]" />
                    </div>

                    <Typography variant="h4" className="mb-2 font-bold text-white">
                        Verificación
                    </Typography>

                    <Typography variant="body2" className="mb-8 text-white/70">
                        {registrationData ? 'Registro iniciado. ' : ''}Ingrese el código enviado a tu correo.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Input
                            placeholder="Código"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            containerClassName="mb-6"
                            className="bg-black/30 text-center tracking-[4px] font-bold text-white"
                        />

                        {error && (
                            <Typography component="p" variant="caption" className="mb-4 block text-error">
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={status === 'loading'}
                            sx={{
                                bgcolor: '#00f3ff',
                                color: '#000',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#00c2cc', boxShadow: '0 0 20px rgba(0,243,255,0.4)' }
                            }}
                        >
                            {status === 'loading' ? 'Confirmando...' : 'Confirmar Cuenta'}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
