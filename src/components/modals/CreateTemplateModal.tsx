import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { notificationService } from '../../services/notification.service';
import { NotificationTemplate } from '../../types/notification.types';

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  background-color: ${props => props.variant === 'primary' ? '#0066cc' : '#f0f0f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#0052a3' : '#e0e0e0'};
  }
  
  &:disabled {
    background-color: ${props => props.variant === 'primary' ? '#99c2ff' : '#f0f0f0'};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const PreviewSection = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const PreviewTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #333;
`;

const PreviewContent = styled.div`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  white-space: pre-wrap;
`;

const VariablesInfo = styled.div`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #666;
`;

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: NotificationTemplate) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, onTemplateCreated }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('SMS');
  const [channel, setChannel] = useState('SMS'); // Default channel
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Extract variables from message
  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = text.match(regex) || [];
    return matches.map(match => match.replace(/\{\{|\}\}/g, ''));
  };
  
  const variables = extractVariables(message);
  
  // Replace variables with values for preview
  const getPreviewText = (text: string): string => {
    let preview = text;
    variables.forEach(variable => {
      preview = preview.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), `<${variable}>`);
    });
    return preview;
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!name.trim()) {
      setError('Template name is required');
      return;
    }
    if (!title.trim()) {
      setError('Template title is required');
      return;
    }
    if (!message.trim()) {
      setError('Template message is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call service to create template
      const newTemplate = await notificationService.createNotificationTemplate({
        name,
        title,
        message,
        type,
        channel,
      });
      
      onTemplateCreated(newTemplate);
      onClose();
    } catch (err) {
      console.error('Error creating template:', err);
      setError('Failed to create template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Create Template</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="template-type">Template Type</Label>
            <Select
              id="template-type"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="SMS">SMS</option>
              <option value="EMAIL">Email</option>
              <option value="IN_APP">In-App</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="template-title">Template Title</Label>
            <Input
              id="template-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter template title"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="template-message">Template Message</Label>
            <TextArea
              id="template-message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter template message. Use {{variable}} for dynamic content."
            />
            <VariablesInfo>
              Available variables: amount, points, prize, msisdn, name
            </VariablesInfo>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="template-channel">Channel</Label>
            <Select
              id="template-channel"
              value={channel}
              onChange={e => setChannel(e.target.value)}
            >
              <option value="SMS">SMS</option>
              <option value="EMAIL">Email</option>
              <option value="PUSH">Push Notification</option>
            </Select>
          </FormGroup>
          
          <PreviewSection>
            <PreviewTitle>Preview</PreviewTitle>
            <PreviewContent>
              <strong>{title}</strong><br />
              {getPreviewText(message)}
            </PreviewContent>
            {variables.length > 0 && (
              <VariablesInfo>
                Variables detected: {variables.join(', ')}
              </VariablesInfo>
            )}
          </PreviewSection>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Template'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateTemplateModal;
