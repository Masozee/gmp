import MainPage from './(main)/page';
import MainLayout from './(main)/layout';

// Replace the re-export with a proper component implementation
export default function HomePage() {
  return (
    <MainLayout>
      <MainPage />
    </MainLayout>
  );
}