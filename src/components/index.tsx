import { GetServerSideProps } from 'next';
import { getSession } from '@src/lib/auth';


const ProtectedPage = ({ session }: { session: any }) => {
  return <div>This is a protected page.</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession(req);

  if (!session) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default ProtectedPage;