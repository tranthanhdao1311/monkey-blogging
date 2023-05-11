import "./App.module.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { publicRoutes } from "./routes/routes";
import { Fragment, Suspense } from "react";
import "swiper/scss";
import "swiper/scss/autoplay";
import MainLayout from "./components/Layout/MainLayout/MainLayout";

function App() {
  return (
    <div>
      <AuthProvider>
        <Suspense>
          <Router>
            <Routes>
              {publicRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = MainLayout;
                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = Fragment;
                }

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page></Page>
                      </Layout>
                    }
                  ></Route>
                );
              })}
              {/* <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
            <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
            <Route path="/tin-tuc" element={<Tintucpage></Tintucpage>}></Route> */}
            </Routes>
          </Router>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
