import { Container, ContainerSucces } from './styles';
import { useForm, ValidationError } from '@formspree/react';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import validator from 'validator';
import ReCAPTCHA from 'react-google-recaptcha';

export function Form() {
  const [state, handleSubmit] = useForm('your-form-id'); // Replace 'your-form-id' with your Form ID
  const [validEmail, setValidEmail] = useState(false);
  const [message, setMessage] = useState('');
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

  function verifyEmail(email: string) {
    setValidEmail(validator.isEmail(email));
  }

  useEffect(() => {
    if (state.succeeded) {
      toast.success('Email successfully sent!', {
        position: toast.POSITION.BOTTOM_LEFT,
        pauseOnFocusLoss: false,
        closeOnClick: true,
        hideProgressBar: false,
        toastId: 'succeeded',
      });
    }
  }, [state.succeeded]);

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaVerified(value !== null);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recaptchaVerified) {
      toast.error('Please verify that you are not a robot!');
      return;
    }
    handleSubmit(event);
  };

  return (
    <Container>
      {state.succeeded ? (
        <ContainerSucces>
          <h3>Thanks for getting in touch!</h3>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Back to the top
          </button>
          <ToastContainer />
        </ContainerSucces>
      ) : (
        <>
          <h2>Get in touch using the form</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              placeholder="Email"
              id="email"
              type="email"
              name="email"
              onChange={(e) => {
                verifyEmail(e.target.value);
              }}
              required
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
            <textarea
              required
              placeholder="Send a message to get started."
              id="message"
              name="message"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
            <ReCAPTCHA
              sitekey="your-site-key" // Replace 'your-site-key' with your actual reCAPTCHA site key
              onChange={handleRecaptchaChange}
            />
            <button
              type="submit"
              disabled={state.submitting || !validEmail || !message}
            >
              Submit
            </button>
          </form>
          <ToastContainer />
        </>
      )}
    </Container>
  );
}
