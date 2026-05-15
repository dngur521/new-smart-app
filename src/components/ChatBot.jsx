import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Fab,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../hooks/useAuth';
import { useSendChat } from '../hooks/useApi';

export default function ChatBot() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { mutate: sendChat, isPending } = useSendChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  if (!isAuthenticated) return null;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const history = messages.slice(-20);
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');

    sendChat(
      { message: trimmed, history },
      {
        onSuccess: (data) => {
          setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        },
        onError: () => {
          setMessages(prev => [...prev, { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            width: 360,
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: 1300,
          }}
        >
          <Box sx={{
            px: 2, py: 1.5,
            bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>AI 어시스턴트</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {messages.length === 0 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <SmartToyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">무엇을 도와드릴까요?</Typography>
                <Typography variant="caption" color="text.disabled">에어컨 제어, 온도 조회 등</Typography>
              </Box>
            )}
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <Box sx={{
                  maxWidth: '80%',
                  px: 1.5, py: 1,
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'action.hover',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isPending && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{ px: 2, py: 1.2, borderRadius: '16px 16px 16px 4px', bgcolor: 'action.hover' }}>
                  <CircularProgress size={16} />
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              size="small"
              placeholder="메시지 입력... (Enter 전송)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isPending}
              sx={{ flexShrink: 0 }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? <CloseIcon /> : <SmartToyIcon />}
      </Fab>
    </>
  );
}
