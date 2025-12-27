import { Box, InputBase, InputLabel, Typography, Select } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    border: '1px solid',
    borderColor: alpha(theme.palette.common.white, 0.2),
    fontSize: 16,
    width: '100%',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    '&:hover': {
        borderColor: alpha(theme.palette.common.white, 0.4),
    },
    '&::placeholder': {
        color: alpha(theme.palette.text.primary, 0.5),
        opacity: 1, 
    },
  },
}));

interface CustomInputProps extends React.ComponentProps<typeof InputBase> {
    label?: string;
    id?: string;
    helperText?: string;
    error?: boolean;
    select?: boolean;
    children?: React.ReactNode;
    containerSx?: any;
}

export const Input: React.FC<CustomInputProps> = ({ label, id, helperText, error, select, children, containerSx, ...props }) => {
    return (
        <Box sx={{ width: '100%', mb: 2, ...containerSx }}>
            {label && (
                <InputLabel 
                    shrink 
                    htmlFor={id}
                    sx={{ 
                        fontSize: '1rem', 
                        fontWeight: 'bold', 
                        color: 'text.primary',
                        mb: 1,
                        transform: 'none',
                        position: 'static'
                    }}
                >
                    {label}
                </InputLabel>
            )}
            
            {select ? (
                <Select
                    id={id}
                    fullWidth
                    input={<StyledInputBase error={error} />}
                    {...(props as any)}
                >
                    {children}
                </Select>
            ) : (
                <StyledInputBase 
                    id={id} 
                    fullWidth 
                    error={error}
                    {...props} 
                    sx={{
                        ...(error && {
                            '& .MuiInputBase-input': {
                                borderColor: 'error.main',
                                '&:focus': {
                                    boxShadow: (theme) => `${alpha(theme.palette.error.main, 0.25)} 0 0 0 0.2rem`,
                                }
                            }
                        }),
                        ...props.sx
                    }}
                />
            )}
            
             {helperText && (
                <Typography variant="caption" color={error ? 'error' : 'textSecondary'} sx={{ mt: 0.5, display: 'block' }}>
                    {helperText}
                </Typography>
            )}
        </Box>
    );
};
