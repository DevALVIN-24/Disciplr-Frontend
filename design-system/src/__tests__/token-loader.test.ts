import { loadTokens, getAllTokens } from '../utils/token-loader';
import * as fs from 'fs';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('token-loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('loadTokens', () => {
    it('should parse valid JSON', () => {
      mockedFs.readFileSync.mockReturnValue('{"color": {"primary": "red"}}');
      const tokens = loadTokens('colors.json');
      expect(tokens).toEqual({"color": {"primary": "red"}});
    });

    it('should throw if file does not exist', () => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });
      expect(() => loadTokens('nonexistent.json')).toThrow('File not found');
    });

    it('should throw if JSON is malformed', () => {
        mockedFs.readFileSync.mockReturnValue('{"invalid": }');
        expect(() => loadTokens('invalid.json')).toThrow();
    });
  });

  describe('getAllTokens', () => {
    it('should merge all tokens', () => {
        mockedFs.readFileSync.mockImplementation((path) => {
            if (path.toString().includes('colors.json')) return '{"color": "red"}';
            if (path.toString().includes('typography.json')) return '{"font": "sans"}';
            if (path.toString().includes('spacing.json')) return '{"space": "4px"}';
            if (path.toString().includes('shadows.json')) return '{"shadow": "1px"}';
            if (path.toString().includes('motion.json')) return '{"motion": "ease"}';
            if (path.toString().includes('borders.json')) return '{"border": "1px"}';
            return '{}';
        });

        const allTokens = getAllTokens();
        expect(allTokens).toEqual({
            "color": "red",
            "font": "sans",
            "space": "4px",
            "shadow": "1px",
            "motion": "ease",
            "border": "1px"
        });
    });

    it('should continue and warn if a file fails to load', () => {
        mockedFs.readFileSync.mockImplementation((path) => {
            if (path.toString().includes('colors.json')) return '{"color": "red"}';
            if (path.toString().includes('typography.json')) throw new Error('File not found');
            return '{}';
        });

        const allTokens = getAllTokens();
        expect(allTokens).toEqual({"color": "red"});
        expect(console.warn).toHaveBeenCalled();
    });
    
    it('should continue and warn if a file has malformed JSON', () => {
        mockedFs.readFileSync.mockImplementation((path) => {
            if (path.toString().includes('colors.json')) return '{"color": "red"}';
            if (path.toString().includes('typography.json')) return '{"invalid": }';
            return '{}';
        });

        const allTokens = getAllTokens();
        expect(allTokens).toEqual({"color": "red"});
        expect(console.warn).toHaveBeenCalled();
    });
  });
});
