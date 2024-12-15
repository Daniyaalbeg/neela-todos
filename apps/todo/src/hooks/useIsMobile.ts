import { useMediaQuery } from './useMediaQuery'

export function useIsMobile() {
	const isMobile = useMediaQuery('(max-width: 768px)')
	return isMobile
}
