import { Container, ContainerSucces } from './styles';
import { useForm, ValidationError } from '@formspree/react';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import validator from 'validator';

export function Form() {
  const [state, handleSubmit] = useForm('myyrwnjg'); // Replace 'your-form-id' with your Form ID
  const [validEmail, setValidEmail] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Proceed with form submission
    try {
      await handleSubmit(event);

      // Send form data to specified email address
      const formData = new FormData();
      formData.append('email', event.currentTarget.email.value);
      formData.append('message', event.currentTarget.message.value);

      await fetch('https://api.emailserviceprovider.com/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'rahulthangamani2002@gmail.com',
          subject: 'New Message from Contact Form',
          body: `
            Email: ${event.currentTarget.email.value}
            Message: ${event.currentTarget.message.value}
          `,
        }),
      });

      // Clear form fields after successful submission if needed
      // resetFormFields();
    } catch (error) {
      // Handle form submission error
      console.error('Form submission error:', error);
      // toast.error('Failed to submit the form. Please try again later.');
    }
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
