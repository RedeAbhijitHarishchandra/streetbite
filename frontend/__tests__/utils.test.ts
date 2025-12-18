import { cn } from '@/lib/utils'

describe('cn utility', () => {
    it('combines classes correctly', () => {
        expect(cn('flex', 'items-center')).toBe('flex items-center')
    })

    it('handles conditions', () => {
        expect(cn('flex', true && 'items-center', false && 'justify-center')).toBe('flex items-center')
    })

    it('merges tailwind classes', () => {
        expect(cn('p-4', 'p-2')).toBe('p-2')
    })
})
