import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { TerrenosCompare } from '../MainPage';
import { LoginPage } from '../Login/LoginPage';
import { RegisterPage } from '../Register/RegisterPage';
import { AccountSettingsPage } from '../AccountSettings/AccountSettingsPage';
import { TerrainDetail } from '@/MainPage/TerrainDetail';
import VerifyEmail from '@/Verificacion/VerifyEmail';
import { CompareProvider } from '@/contexto/CompareContext';
import { CompareBar } from '@/componentes/CompareBar';
import { CompararTerrenos } from '@/ComparadorTerrenos';
import { LayoutMain } from '@/layouts/LayoutMain';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { ThemeProvider } from '@/context/ThemeContext';
import VerifyEmailPage from '@/Register/VerifyEmailPage';
import { Toaster } from 'react-hot-toast';
import { UserOnboardingStepper } from '@/componentes/UserOnboardingStepper';
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminRoute } from './AdminRoute';
import TerrenosMap from '@/componentes/RecommendationV3';

const ProtectedRoute = ({ children }) => {
	const { loggedIn } = useAuth();
	return loggedIn ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
	return (
		<BrowserRouter>

			<AuthProvider>
				<CompareProvider>
					<ThemeProvider>
						{/* <ChatbaseBot /> */}
						<Toaster position="top-right" />

						<Routes>
							<Route path="/" element={<TerrenosCompare />} /> 
							{/* <Route path="/" element={<TerrenosMap />} /> */}
							<Route path="/userOnboarding" element={<UserOnboardingStepper />} />
							<Route path="/register" element={<RegisterPage />} />
							<Route path="/verify-email" element={<VerifyEmail />} />
							<Route path="/preVerify-email" element={<VerifyEmailPage />} />
							<Route path="/login" element={<LoginPage />} />
							<Route
								path="/account"
								element={
									<ProtectedRoute>
										<LayoutMain>
											<AccountSettingsPage />
										</LayoutMain>
									</ProtectedRoute>
								}
							/>
							<Route path="*" element={<Navigate to="/" replace />} />
							<Route path="/terreno/:id" element={<LayoutMain>
																<TerrainDetail />
															</LayoutMain>} />
							<Route path="/comparar/:ids" element={<LayoutMain>
															<CompararTerrenos />
														</LayoutMain>} />
							<Route path="/recomendaciones" element={
															<TerrenosMap />
														} />
							<Route
								path="/admin"
								element={
									<AdminRoute>
										<AdminDashboard />
									</AdminRoute>
								}
							/>
						</Routes>
					
					<CompareBar />
					</ThemeProvider>
				</CompareProvider>
			</AuthProvider>
				  
		</BrowserRouter>
	);
}