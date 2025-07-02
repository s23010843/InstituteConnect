interface GoogleCredentialResponse {
  credential: string;
}

interface AppleSignInResponse {
  authorization: {
    code: string;
    id_token: string;
  };
  user?: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

export const initializeGoogleAuth = () => {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

export const initializeAppleAuth = () => {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

export const signInWithGoogle = (): Promise<GoogleCredentialResponse> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Sign-In not loaded'));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id',
      callback: (response: GoogleCredentialResponse) => {
        resolve(response);
      },
    });

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Show one-tap fallback
        window.google.accounts.id.renderButton(
          document.createElement('div'),
          {
            theme: 'outline',
            size: 'large',
            type: 'standard',
          }
        );
      }
    });
  });
};

export const signInWithApple = (): Promise<AppleSignInResponse> => {
  return new Promise((resolve, reject) => {
    if (!window.AppleID) {
      reject(new Error('Apple Sign-In not loaded'));
      return;
    }

    window.AppleID.auth.init({
      clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'demo.excellence.institute',
      scope: 'name email',
      redirectURI: window.location.origin,
      state: 'signin',
      usePopup: true,
    });

    window.AppleID.auth.signIn()
      .then((response: AppleSignInResponse) => {
        resolve(response);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

// Global type declarations
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
    AppleID: {
      auth: {
        init: (config: any) => void;
        signIn: () => Promise<AppleSignInResponse>;
      };
    };
  }
}
